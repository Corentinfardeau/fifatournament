package com.soccup.models;

import android.util.Log;

import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Valentin on 12/06/2015.
 */
public class Tournament {
    private Api api = new Api();
    private String idTournament;
    private int nbPlayers;
    private JSONArray teams;

    // CONSTRUCTOR
    public Tournament(){}

    // CREATE A TOURNAMENT
    public void createTournament(Map<String, Object> options, final Callback cb) {
        api.createTournament(options, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Create Tournament", error); }

            public void onSuccess(Response response) throws IOException, JSONException {
                String data = response.body().string();
                JSONObject json = new JSONObject(data);
                idTournament = json.getString("_id");
                nbPlayers = json.getInt("nbPlayers");

                Map<String, Object> tournament = new HashMap<String, Object>();
                tournament.put("tournament", json);
                cb.onSuccess(tournament);
            }
        });
    }

    // CREATE TEAMS
    public void createTeams(final Callback cb){

        // OPTIONS OF TEAM CREATIONS
        Map<String, Object> optionsTeams = new HashMap<String, Object>();
        optionsTeams.put("idTournament", idTournament);
        optionsTeams.put("nbPlayers", nbPlayers);

        api.createTeams(optionsTeams, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Create Teams", error); }

            public void onSuccess(Response response) throws IOException, JSONException {
                String data = response.body().string();
                Log.d("TEAM CREATED", data);
                teams = new JSONArray(data);
                cb.onSuccess(new HashMap<String, Object>());

            }
        });
    }

    // CREATE PLAYERS
    public void createPlayers(Map<String, Object> options, final Callback cb) {
        api.createPlayers(options, new Api.ApiCallback() {
            public void onFailure(String error) {
                Log.d("Create Players", error);
            }

            public void onSuccess(Response response) throws IOException, JSONException {
                cb.onSuccess(new HashMap<String, Object>());
            }
        });
    }

    // GET TOURNAMENT BY ID
    public void getTournament(String idTournament, final Callback cb) {
        api.getTournamentById(idTournament, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Get Tournament", error);}

            public void onSuccess(Response response) throws IOException, JSONException {
                String data = response.body().string();
                final JSONObject tournament = new JSONObject(data);
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("tournament", tournament);
                cb.onSuccess(options);
            }
        });
    }

    // GETTERS
    public int getNbPlayers() {
        return nbPlayers;
    }
    public String getIdTournament() {
        return idTournament;
    }
    public JSONArray getTeams() {
        return teams;
    }

    // CALLBACK
    public interface Callback{
        public void onSuccess(Map<String, Object> options) throws JSONException;
    }
}
