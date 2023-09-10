import { Controller, UseGuards, Request, Get } from "@nestjs/common";
import { MatchesService } from "./matches.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('matches')
export class MatchesController {
    constructor(private matchesService: MatchesService) {}

    @UseGuards(JwtAuthGuard)
    @Get('history')
    async getHistory(@Request() req) 
    {
        return await this.matchesService.getMatchesHistory(req.user.id);
    }
}