import Sinon from "sinon";
import { IUser } from "../../../interface/user";
import * as UserService from "../../../services/user.services";
import * as AdminService from "../../../services/admin.services";
import expect from "expect";

describe("Admin service unit test", () => {
  const user: IUser = {
    id: "7269c1d6-0f4e-4e6a-a1aa-b0bf142aab7e",
    name: "john doe",
    email: "john@email.com",
    permissions: [],
    password: "test123",
  };
  let getUserByIdStub: Sinon.SinonStub,
    getAllUsersStub: Sinon.SinonStub,
    createUserStub: Sinon.SinonStub,
    updateUserStub: Sinon.SinonStub,
    deleteUserStub: Sinon.SinonStub;

  describe("Admin:Service =>  Get user", () => {
    beforeEach(() => {
      getUserByIdStub = Sinon.stub(UserService, "getUserById");
      getAllUsersStub = Sinon.stub(UserService, "getAllUsers");
    });
    afterEach(() => {
      getUserByIdStub.restore();
      getAllUsersStub.restore();
    });

    it("Should return a user when passed id", async () => {
      const { password, ...otherInfo } = user;
      getUserByIdStub.resolves({ ...otherInfo });

      const id = "0299df4f-e26d-4b2d-a0e2-e6eed7a21db3";
      await expect(AdminService.getUser(id)).resolves.toStrictEqual({
        ...otherInfo,
      });
    });

    it("Should return an array of object when id is not passed", async () => {
      const { password, ...otherInfo } = user;
      getAllUsersStub.resolves([{ ...otherInfo }, { ...otherInfo }]);
      await expect(AdminService.getUser()).resolves.toStrictEqual([
        { ...otherInfo },
        { ...otherInfo },
      ]);
    });
  });
  describe("Admin:Service =>  Create user", () => {
    beforeEach(() => {
      createUserStub = Sinon.stub(UserService, "createUser");
    });
    afterEach(() => {
      createUserStub.restore();
    });

    it("Should return newly created user", async () => {
      const { password, ...otherInfo } = user;
      createUserStub.resolves({ ...otherInfo });
      await expect(AdminService.createUser(user)).resolves.toStrictEqual({
        ...otherInfo,
      });
    });
  });

  describe("Admin:Service =>  Update user", () => {
    let newName: string, newEmail: string;
    before(() => {
      newName = "Jane Doe";
      newEmail = "janedoe@test.com";
    });
    beforeEach(() => {
      updateUserStub = Sinon.stub(UserService, "updateUser");
    });
    afterEach(() => {
      updateUserStub.restore();
    });

    it("Should return newly updated user", async () => {
      const { password, ...otherInfo } = user;
      updateUserStub.resolves({ ...otherInfo, name: newName, email: newEmail });
      await expect(
        AdminService.updateUser({
          name: newName,
          email: newEmail,
        }),
      ).resolves.toStrictEqual({
        ...otherInfo,
        name: newName,
        email: newEmail,
      });
    });
  });
  describe("Admin:Service =>  Delete user", () => {
    beforeEach(() => {
      deleteUserStub = Sinon.stub(UserService, "deleteUser");
    });
    afterEach(() => {
      deleteUserStub.restore();
    });

    it("Should return newly deleted user", async () => {
      const { password, ...otherInfo } = user;
      deleteUserStub.resolves({
        message: "User deleted Successfully",
      });
      const userId = "8a2e7bab-8c4f-458e-896b-3d5e5ebee42e";
      await expect(AdminService.deleteUser(userId)).resolves.toStrictEqual({
        message: "User deleted Successfully",
      });
    });
  });
});
