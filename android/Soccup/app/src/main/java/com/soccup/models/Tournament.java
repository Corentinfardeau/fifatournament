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

    public Tournament(){}

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

    public void createTeams(final Callback cb){
        // OPTIONS OF TEAM CREATIONS
        Map<String, Object> optionsTeams = new HashMap<String, Object>();
        optionsTeams.put("idTournament", idTournament);
        optionsTeams.put("nbPlayers", nbPlayers);

        api.createTeams(optionsTeams, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Create Teams", error); }

            public void onSuccess(Response response) throws IOException, JSONException {
                String data = response.body().string();
                teams = new JSONArray(data);
                cb.onSuccess(new HashMap<String, Object>());

            }
        });
    }

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
