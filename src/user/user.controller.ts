import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { User as UserModel } from "@prisma/client";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(":id")
  async getUser(@Param("id") id: string) {
    return this.userService.user({ id: Number(id) });
  }

  @Post()
  async signupUser(@Body() userData: { email: string; name: string }): Promise<UserModel> {
    return this.userService.createUser({
      balance: 0,
      country: undefined,
      creation_date: undefined,
      date_of_birth: undefined,
      password_hash: "",
      email: userData.email, username: userData.name,
    });
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() userData: { email: string; name: string },
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { user_id: Number(id) },
      data: userData,
    });
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string): Promise<UserModel> {
    return this.userService.deleteUser({ user_id: Number(id) });
  }
}
