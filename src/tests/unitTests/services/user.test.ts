import bcrypt from "bcryptjs";
import { UUID } from "crypto";
import expect from "expect";
import Sinon from "sinon";
import { EncryptionError, NotFoundError } from "../../../errors";
import { IUser } from "../../../interface/user";
import * as UserModel from "../../../models/User.model";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../../../services/user.services";
import * as utils from "../../../utils/getUUID";

describe("User service unit test suite", () => {
  const user: Partial<IUser> = {
    name: "John doe",
    email: "john@test.com",
    permissions: [],
  };
  let bcryptHashStub: Sinon.SinonStub,
    userModelUpdateUserStub: Sinon.SinonStub,
    userModelCreateuserStub: Sinon.SinonStub,
    getUUIDStub: Sinon.SinonStub,
    userModelGetUserByEmailStub: Sinon.SinonStub,
    userModelGetUserByIdStub: Sinon.SinonStub;
  describe("Create User", () => {
    beforeEach(() => {
      userModelGetUserByEmailStub = Sinon.stub(UserModel, "getUserByEmail");
      bcryptHashStub = Sinon.stub(bcrypt, "hash");
      userModelCreateuserStub = Sinon.stub(UserModel, "createUser");
      getUUIDStub = Sinon.stub(utils, "getUUID");
    });
    afterEach(() => {
      bcryptHashStub.restore();
      userModelGetUserByEmailStub.restore();
      userModelCreateuserStub.restore();
      getUUIDStub.restore();
      delete user.password;
    });
    it("Should create new User", async () => {
      user.password = "test123";

      userModelGetUserByEmailStub.resolves(undefined);
      userModelCreateuserStub.resolves(user);

      getUUIDStub.returns("f53bc853-16ae-4f56-bf55-e63e3b9ebc45");
      bcryptHashStub.resolves("hashedPassword");
      await createUser(user as Omit<IUser, "id">);

      // Ensure bcrypt.hash(),  getUUUID() and UserModel.createUser() are
      // called only once
      expect(bcryptHashStub.callCount).toBe(1);
      expect(getUUIDStub.callCount).toBe(1);
      expect(userModelCreateuserStub.callCount).toBe(1);

      // Ensure arguments passed to bcrypt are user password with salt value of 10
      expect(bcryptHashStub.getCall(0).args).toStrictEqual([user.password, 10]);

      // Ensure arguments passed to UserModel.createUser is a proper user object
      expect(userModelCreateuserStub.getCall(0).args).toStrictEqual([
        {
          ...user,
          id: "f53bc853-16ae-4f56-bf55-e63e3b9ebc45",
          password: "hashedPassword",
        },
      ]);
    });
  });
  describe("Get User by id", () => {
    beforeEach(() => {
      userModelGetUserByIdStub = Sinon.stub(UserModel, "getUserById");
    });

    afterEach(() => {
      userModelGetUserByIdStub.restore();
    });

    it("Should throw error when user is not found", async () => {
      userModelGetUserByIdStub.resolves(null);
      const id = "2bab51dc-ee8d-4f23-861e-c9f1fe8e07d0";
      await expect(getUserById(id)).rejects.toThrow(
        new NotFoundError(`User with ${id} not found`),
      );
    });

    it("Should return user when found", async () => {
      const id: UUID = "b2077771-7707-4c9f-9e6d-9a549107e168";
      const localUser: Omit<IUser, "password"> = {
        ...(user as IUser),
        id,
      };
      userModelGetUserByIdStub.resolves(localUser);
      await expect(UserModel.getUserById(id)).resolves.toStrictEqual(localUser);
    });
  });

  describe("Get User by email", () => {
    beforeEach(() => {
      userModelGetUserByEmailStub = Sinon.stub(UserModel, "getUserByEmail");
      userModelGetUserByIdStub = Sinon.stub(UserModel, "getUserById");
    });

    afterEach(() => {
      userModelGetUserByEmailStub.restore();
      userModelGetUserByIdStub.restore();
    });

    it("Should throw error when user is not found", async () => {
      userModelGetUserByEmailStub.resolves(undefined);
      const email = "jon@test.com";
      await expect(getUserByEmail(email)).rejects.toThrow(
        new NotFoundError(`User with ${email} not found`),
      );
    });

    it("Should return user when found", async () => {
      const email = "john@test.com";
      const localUser: Omit<IUser, "password"> = {
        ...(user as IUser),
        id: "45cdc41f-fec9-483a-b2fe-e0ed9735fde5",
      };
      userModelGetUserByEmailStub.resolves(localUser);
      await expect(UserModel.getUserByEmail(email)).resolves.toStrictEqual(
        localUser,
      );
    });
  });
  describe("Update user", () => {
    let password: string,
      newEmail: string,
      newName: string,
      newPassword: string,
      id: UUID;

    before(() => {
      password = "test123";
      newEmail = "testnew@email.com";
      newName = "Jane Doe";
      newPassword = "newPassword";
      id = "630e8ca7-9ba1-46f2-b6b0-693784fd50a8";
    });

    beforeEach(() => {
      bcryptHashStub = Sinon.stub(bcrypt, "hash");
      userModelUpdateUserStub = Sinon.stub(UserModel, "updateUser");
      userModelCreateuserStub = Sinon.stub(UserModel, "createUser");
      getUUIDStub = Sinon.stub(utils, "getUUID");
    });
    afterEach(() => {
      bcryptHashStub.restore();
      userModelUpdateUserStub.restore();
      userModelCreateuserStub.restore();
      getUUIDStub.restore();
    });

    it("Should update user email", async () => {
      userModelUpdateUserStub.resolves({ ...user, email: newEmail });
      userModelCreateuserStub.resolves({
        ...user,
        id,
      });
      getUUIDStub.returns(id);
      bcryptHashStub.resolves("hashedPassword");
      const newUser = await createUser({ ...user, password } as IUser);
      const data = await updateUser(newUser.id, { email: newEmail });
      expect(data.email).toBe(newEmail);
      expect(userModelCreateuserStub.callCount).toBe(1);
      expect(userModelCreateuserStub.getCall(0).args).toStrictEqual([
        {
          ...user,
          id,
          password: "hashedPassword",
        },
      ]);
      expect(userModelUpdateUserStub.getCall(0).args).toStrictEqual([
        id,
        {
          email: newEmail,
        },
      ]);
    });
    it("Should update user's name", async () => {
      bcryptHashStub.resolves("hashedPassword");
      getUUIDStub.returns(id);
      userModelUpdateUserStub.resolves({ ...user, name: newName, id });
      userModelCreateuserStub.resolves({
        ...user,
        id,
      });
      const newUser = await createUser({ ...user, password } as IUser);
      await expect(updateUser(id, { name: newName })).resolves.toStrictEqual({
        ...newUser,
        name: newName,
      });
      expect(userModelCreateuserStub.callCount).toBe(1);
      expect(userModelUpdateUserStub.callCount).toBe(1);
      expect(userModelCreateuserStub.getCall(0).args).toStrictEqual([
        {
          ...user,
          id,
          password: "hashedPassword",
        },
      ]);
      expect(userModelUpdateUserStub.getCall(0).args).toStrictEqual([
        id,
        {
          name: newName,
        },
      ]);
    });
    it("Should update password", async () => {
      getUUIDStub.returns(id);
      bcryptHashStub.resolves("hashedPassword");
      userModelUpdateUserStub.resolves({ ...user, id });
      userModelCreateuserStub.resolves({
        ...user,
        id,
      });
      const newUser = await createUser({ ...user, password } as IUser);
      await expect(updateUser(id, { password: "1234" })).resolves.toStrictEqual(
        {
          ...newUser,
          id,
        },
      );
      expect(userModelCreateuserStub.callCount).toBe(1);
      expect(userModelCreateuserStub.getCall(0).args).toStrictEqual([
        {
          ...user,
          id,
          password: "hashedPassword",
        },
      ]);
      expect(userModelUpdateUserStub.callCount).toBe(1);
      expect(userModelUpdateUserStub.getCall(0).args).toStrictEqual([
        id,
        {
          password: "hashedPassword",
        },
      ]);
    });
    it("Should throw erorr when none of [email, password, name] are not provided", async () => {
      getUUIDStub.returns(id);
      bcryptHashStub.resolves("hashedPassword");
      userModelUpdateUserStub.resolves({ ...user, name: newName });
      userModelCreateuserStub.resolves({
        ...user,
        id,
      });
      await createUser({ ...user, password } as IUser);
      expect(updateUser(id, {})).resolves.toThrow(
        new EncryptionError(`No data to update`),
      );
      expect(userModelCreateuserStub.callCount).toBe(1);
      expect(userModelUpdateUserStub.callCount).toBe(0);
      expect(userModelCreateuserStub.getCall(0).args).toStrictEqual([
        {
          ...user,
          id,
          password: "hashedPassword",
        },
      ]);
    });
  });
});
