package com.soccup.models;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.json.JSONException;

import java.io.IOException;
import java.util.Map;

/**
 * Created by Valentin on 28/05/2015.
 */

public class Api{
    
    // DATA
    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private OkHttpClient client;
    private String address;
    private Request.Builder builder;

    // CONSTRUCTOR
    public Api(){
        this.client = new OkHttpClient();
        this.address = "http://192.168.1.72:8080/";//"http:192.168.1.72:8080/";//"http://10.0.3.2:8080/";//"http://10.30.1.218:8080/";
        this.builder = new Request.Builder();
    }

    // TOURNAMENTS

    /**
     * createTournament
     * @param options is Map<String, Object> contains String type, Boolean bePublic, Boolean random, int nbPlayers, int nbPlayersByTeam
     * @param cb Callback to return an empty tournament object
     * @return void
     */

    public void createTournament(Map<String, Object> options, final ApiCallback cb){
        String url = this.address + "api/tournament/create";
        String json = "{\"type\":\""+ options.get("type") + "\","
            + "\"public\":"+ options.get("bePublic") + ","
            + "\"random\":"+ options.get("random") + ","
            + "\"nbPlayers\":"+ options.get("nbPlayers") + ","
            + "\"nbPlayersByTeam\":"+ options.get("nbPlayersByTeam") + "}";
        String onError = "Impossible de créer le tournoi";

        // BUILD JSON
        RequestBody body = RequestBody.create(JSON, json);

        // BUILD REQUEST
        Request request = this.builder.url(url).post(body).build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * getTournamentByToken
     * @param token is the token of a tournament -> String
     * @param cb Callback to return a tournament object
     * @return void
     */

    public void getTournamentByToken(String token, final ApiCallback cb){
        String url = this.address + "api/tournament/join/" + token;
        String onError = "Impossible de récupérer le tournoi ayant pour token : " + token;

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * getTournamentById
     * @param idTournament is the id of a tournament -> String
     * @param cb Callback to return a tournament object
     * @return void
     */

    public void getTournamentById(String idTournament, final ApiCallback cb){
        String url = this.address + "api/tournament/" + idTournament;
        String onError = "Impossible de récupérer le tournoi d'id : " + idTournament;

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * getCompetitionTournament
     * @param idTournament is the id of a tournament -> String
     * @param cb Callback to return the competition of the tournament (league / cup).
     * @return void
     */

    public void getCompetitionTournament(String idTournament, final ApiCallback cb){
        String url = this.address + "api/tournament/" + idTournament + "/competition";
        String onError = "Impossible de récupérer la compétition du tournoi d'id : " + idTournament;

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * getTeamsTournament
     * @param idTournament is the id of a tournament -> String
     * @param cb Callback to return an array of teams of the tournament.
     * @return void
     */

    public void getTeamsTournament(String idTournament, final ApiCallback cb){
        String url = this.address + "api/tournament/" + idTournament + "/teams";
        String onError = "Impossible de récupérer les équipes du tournoi d'id : " + idTournament;

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    // LEAGUES

    /**
     * createLeague
     * @param idTournament is the id of a tournament -> String
     * @param cb Callback to return the empty league
     * @return void
     */

    public void createLeague(String idTournament, final ApiCallback cb){
        String url = this.address + "api/league/create/" + idTournament;
        String onError = "Impossible de créer la ligue dans le tournoi d'id : " + idTournament;
        String json = "";

        // BUILD JSON
        RequestBody body = RequestBody.create(JSON, json);

        // BUILD REQUEST
        Request request = this.builder.url(url).post(body).build();

        // CALL REQUEST
        call(request, onError, cb);
    }

    /**
     * getLeague
     * @param idLeague is the id of a league -> String
     * @param cb Callback to return the league
     * @return void
     */

    public void getLeague(String idLeague, final ApiCallback cb){
        String url = this.address + "api/league/" + idLeague;
        String onError = "Impossible de récupérer la ligue d'id : " + idLeague;

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * getTeamsLeague
     * @param idLeague is the id of a league -> String
     * @param cb Callback to return an array of teams's league
     * @return void
     */

    public void getTeamsLeague(String idLeague, final ApiCallback cb){
        String url = this.address + "api/league/" + idLeague + "/teams";
        String onError = "Impossible de récupérer les équipes de la ligue d'id : " + idLeague;

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * getRankingLeague
     * @param options is Map<String, Object> contains String id_league, String order_by
     * @param cb Callback to return an object that contains an array of team order by the parameter "order_by"
     * @return void
     */

    public void getRankingLeague(Map<String, Object> options, final ApiCallback cb){
        String url = this.address + "api/league/" + options.get("idLeague") + "/ranking/" + options.get("order_by");
        String onError = "Impossible de récupérer les équipes ordonnées de la ligue d'id : " + options.get("id_league");

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    // MATCHS

    /**
     * createMatchsLeague
     * @param options is Map<String, Object> contains String id_league, array teams
     * @param cb Callback to return the league with all the matchs ID added.
     * @return void
     */

    public void createMatchsLeague(Map<String, Object> options, final ApiCallback cb){
        String url = this.address + "api/matchs/create/" + options.get("id_league");
        String onError = "Impossible de créer les matchs de la ligue d'id : " + options.get("id_league");
        String json = "{\"teams\":"  + (String) options.get("teams") + "}";

        // BUILD JSON
        RequestBody body = RequestBody.create(JSON, json);

        // BUILD REQUEST
        Request request = this.builder.url(url).post(body).build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * getMatch
     * @param idMatch is the id of a match -> String
     * @param cb Callback to return the match.
     * @return void
     */

    public void getMatch(String idMatch, final ApiCallback cb){
        String url = this.address + "api/match/" + idMatch;
        String onError = "Impossible de récupérer le match d'id : " + idMatch;

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * updateMatch
     * @param options is Map<String, Object> contains String idMatch, Boolean played, int goalHomeTeam, int goalAwayTeam
     * @param cb Callback to return the match updated.
     * @return void
     */

    public void updateMatch(Map<String, Object> options, final ApiCallback cb){
        String url = this.address + "api/match/update/" + options.get("idMatch");
        String json = "{\"played\":\""+ options.get("played") + "\","
                + "\"goalHomeTeam\":"+ options.get("goalHomeTeam") + ","
                + "\"goalAwayTeam\":"+ options.get("goalAwayTeam") + "}";
        String onError = "Impossible de mettre à jour le match d'id : " + options.get("idMatch");

        // BUILD JSON
        RequestBody body = RequestBody.create(JSON, json);

        // BUILD REQUEST
        Request request = this.builder.url(url).post(body).build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    // TEAMS

    /**
     * createTeams
     * @param options is Map<String, Object> contains String idTournament, int nbPlayers
     * @param cb Callback to return an array with all the teams created.
     * @return void
     */

    public void createTeams(Map<String, Object> options, final ApiCallback cb){
        String url = this.address + "api/team/create/" + options.get("idTournament");
        String json = "{\"nbPlayers\":"+ options.get("nbPlayers") + "}";
        String onError = "Impossible de créer les équipes du tournoi d'id : " + options.get("idTournament");

        // BUILD JSON
        RequestBody body = RequestBody.create(JSON, json);

        // BUILD REQUEST
        Request request = this.builder.url(url).post(body).build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * getTeam
     * @param idTeam is the id of a team -> String
     * @param cb Callback to return the team.
     * @return void
     */

    public void getTeam(String idTeam, final ApiCallback cb){
        String url = this.address + "api/team/" + idTeam;
        String onError = "Impossible de récupérer l'équipe d'id : " + idTeam;

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * getTeamPlayers
     * @param idTeam is the id of a team -> String
     * @param cb Callback to return an array of players ID.
     * @return void
     */

    public void getTeamPlayers(String idTeam, final ApiCallback cb){
        String url = this.address + "api/team/" + idTeam + "/players";
        String onError = "Impossible de récupérer les joueurs de l'équipe d'id : " + idTeam;

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * updateTeam
     * @param options is Map<String, Object> contains String idTeam, String teamName, int played, int won, int lost, int drawn, int gf, int ga, int gd, int pts
     * @param cb Callback to return the Team updated.
     * @return void
     */

    public void updateTeam(Map<String, Object> options, final ApiCallback cb){
        String url = this.address + "api/team/update/" + options.get("idTeam");
        String json = "{\"teamName\":\""+ options.get("teamName") + "\","
                + "\"played\":"+ options.get("played") + ","
                + "\"won\":"+ options.get("won") + ","
                + "\"lost\":"+ options.get("lost") + ","
                + "\"drawn\":"+ options.get("drawn") + ","
                + "\"gf\":"+ options.get("gf") + ","
                + "\"ga\":"+ options.get("ga") + ","
                + "\"gd\":"+ options.get("gd").toString() + ","
                + "\"pts\":"+ options.get("pts") + "}";
        String onError = "Impossible de mettre à jour l'équipe d'id : " + options.get("idTeam");

        // BUILD JSON
        RequestBody body = RequestBody.create(JSON, json);

        // BUILD REQUEST
        Request request = this.builder.url(url).post(body).build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    // PLAYERS

    /**
     * createPlayers
     * @param options is Map<String, Object> contains String idTournament, array players
     * @param cb Callback to return all the players created.
     * @return void
     */

    public void createPlayers(Map<String, Object> options, final ApiCallback cb){
        String url = this.address + "api/player/create/" + options.get("idTournament");
        String json = "{\"players\":"+ options.get("players") + "}";
        String onError = "Impossible de créer les joueurs du tournoi d'id : " + options.get("idTournament");

        // BUILD JSON
        RequestBody body = RequestBody.create(JSON, json);

        // BUILD REQUEST
        Request request = this.builder.url(url).post(body).build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * getPlayer
     * @param idPlayer is the id of a player -> String
     * @param cb Callback to return the player
     * @return void
     */

    public void getPlayer(String idPlayer, final ApiCallback cb){
        String url = this.address + "api/player/" + idPlayer;
        String onError = "Impossible de récupérer le joueur d'id : " + idPlayer;

        // BUILD REQUEST
        Request request = this.builder.url(url).get().build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    /**
     * updatePlayer
     * @param options is Map<String, Object> contains String idPlayer, String playerName, int nbGoal
     * @param cb Callback to return the player updated.
     * @return void
     */

    public void updatePlayer(Map<String, Object> options, final ApiCallback cb){
        String url = this.address + "api/player/update/" + options.get("idPlayer");
        String json = "{\"playerName\":\""+ options.get("playerName") + "\","
                + "\"nbGoal\":"+ options.get("nbGoal") + "}";
        String onError = "Impossible de mettre à jour le joueur d'id : " + options.get("idPlayer");

        // BUILD JSON
        RequestBody body = RequestBody.create(JSON, json);

        // BUILD REQUEST
        Request request = this.builder.url(url).post(body).build();

        // CALL REQUEST
        call(request, onError,  cb);
    }

    // CALL REQUEST
    private void call(Request request, final String error, final ApiCallback cb){
        Call call = this.client.newCall(request);
        call.enqueue(new Callback(){
            public void onFailure(Request request, IOException e) {
                cb.onFailure(error);
            }

            public void onResponse(Response response) throws IOException {
                try {
                    if (response.isSuccessful()) {
                        cb.onSuccess(response);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (JSONException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    // API CALLBACK INTERFACE
    public interface ApiCallback{
        public void onFailure(String error);
        public void onSuccess(Response response) throws IOException, JSONException, InterruptedException;
    }
}
