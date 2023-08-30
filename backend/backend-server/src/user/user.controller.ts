import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private UserService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        console.log("c est qui ? :", req.user.sub);
        return await this.UserService.findOne(req.user.sub);
    }
}