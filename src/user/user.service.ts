import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Users } from "@prisma/client";

@Injectable()
export class UserService {
  private queries: { query: string; duration: number }[] = [];

  constructor(private prisma: PrismaService) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    prisma.$on<any>("query", (event: Prisma.QueryEvent) => {
      console.log("Query: " + event.query);
      console.log("Duration: " + event.duration + "ms");
      this.queries.push({ query: event.query, duration: event.duration });
    });
  }

  async user(userWhereUniqueInput: Prisma.UsersWhereUniqueInput): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UsersWhereUniqueInput;
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
  }): Promise<Users[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.users.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UsersCreateInput): Promise<Users> {
    return this.prisma.users.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UsersWhereUniqueInput;
    data: Prisma.UsersUpdateInput;
  }): Promise<Users> {
    const { where, data } = params;
    return this.prisma.users.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UsersWhereUniqueInput): Promise<Users> {
    return this.prisma.users.delete({
      where,
    });
  }

  async getAllUsers(includeDebugInfo = true): Promise<{
    users: Users[];
    queries?: { query: string; duration: number }[];
  }> {
    this.queries = [];
    const users = await this.prisma.users.findMany();

    const result = includeDebugInfo ? { users, queries: this.queries } : { users };
    this.queries = [];

    return result;
  }
}
