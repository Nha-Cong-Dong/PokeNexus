package com.pokenexus.team.controller;

import java.net.URI;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pokenexus.team.dto.CreateTeamRequest;
import com.pokenexus.team.dto.TeamResponse;
import com.pokenexus.team.service.SaveRateLimiter;
import com.pokenexus.team.service.TeamService;

@RestController
@RequestMapping("/api/v1/teams")
@Tag(name = "Teams")
public class TeamController {

    public static final String SHARED_PATH = "/api/v1/teams/shared/";

    private final TeamService teamService;
    private final SaveRateLimiter saveRateLimiter;

    public TeamController(TeamService teamService, SaveRateLimiter saveRateLimiter) {
        this.teamService = teamService;
        this.saveRateLimiter = saveRateLimiter;
    }

    @PostMapping
    @Operation(summary = "Save a team of 1-6 Pokémon and get a share code")
    public ResponseEntity<TeamResponse> create(@Valid @RequestBody CreateTeamRequest request,
                                               HttpServletRequest httpRequest) {
        saveRateLimiter.acquire(httpRequest.getRemoteAddr());
        TeamResponse team = teamService.create(request);
        return ResponseEntity.created(URI.create(SHARED_PATH + team.shareCode())).body(team);
    }

    @GetMapping("/shared/{shareCode}")
    @Operation(summary = "Open a saved team by its case-sensitive 8-character share code")
    public TeamResponse shared(@PathVariable String shareCode) {
        return teamService.findByShareCode(shareCode);
    }
}
