import { Body, Controller, Get, UseGuards, Request, Post } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserService } from "./user.service";
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
    constructor(private UserService: UserService, private readonly jwtService: JwtService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return await this.UserService.findOne(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('setTfaTrue')
    async TurnOnTfa(@Request() req) {
        return await this.UserService.turnOnTfa(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('setTfaFalse')
    async TurnOffTfa(@Request() req) {
        return await this.UserService.turnOffTfa(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('getTfa')
    async GetTfaStatus(@Request() req) {
        return await this.UserService.getTfaStatus(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('getQRcode')
    async GetQRcode(@Request() req) {
        return await this.UserService.getQRcode(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Post('changeGoogle')
    async ChangeGoogle(@Request() req, @Body() google: { secret: string, imageUrl: string }): Promise<any> {
        return await this.UserService.changeGoogle(req.user.sub, google.secret, google.imageUrl);
    }
}