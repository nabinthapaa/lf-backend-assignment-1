import bcypt from "bcryptjs";
import { IUser } from "../../../interface/user";
import * as UserService from "../../../services/user.services";
import Sinon from "sinon";
import { login } from "../../../services/auth.services";
import expect from "expect";
import { BadRequestError, UnauthenticatedError } from "../../../errors";

describe("Auth service unit test", () => {
  const user: Pick<IUser, "email" | "password"> = {
    email: "test@test.com",
    password: "test123",
  };
  let getUserByEmailStub: Sinon.SinonStub, bcryptCompareStub: Sinon.SinonStub;
  describe("Auth:service => login", () => {
    let fullUser: IUser;
    before(() => {
      fullUser = {
        id: "513ad4b7-641e-407a-9e1e-b3d448c14e06",
        email: "test@test.com",
        name: "John doe",
        password: "test1234",
        permissions: [],
      };
    });
    beforeEach(() => {
      getUserByEmailStub = Sinon.stub(UserService, "getUserByEmail");
      bcryptCompareStub = Sinon.stub(bcypt, "compare");
    });

    afterEach(() => {
      getUserByEmailStub.restore();
      bcryptCompareStub.restore();
    });

    it("Should throw error when user with email not found", async () => {
      getUserByEmailStub.resolves(undefined);
      await expect(login(user)).rejects.toThrow(
        new BadRequestError("Invalid email or password"),
      );
    });
    it("Should throw error when password is not correct", async () => {
      getUserByEmailStub.resolves(fullUser);
      bcryptCompareStub.resolves(false);
      await expect(login(fullUser)).rejects.toThrow(
        new UnauthenticatedError("Invalid password"),
      );
    });
    it("Should throw error when password is not correct", async () => {
      const { password, ...otherInfo } = fullUser;
      getUserByEmailStub.resolves({ ...otherInfo });
      bcryptCompareStub.resolves(true);
      const response = await login(user);
      expect(response).toHaveProperty("accessToken");
      expect(response).toHaveProperty("refreshToken");
      expect(response).toHaveProperty("payload");
      expect(response.payload).toStrictEqual({
        ...otherInfo,
      });
    });
  });
});
