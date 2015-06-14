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
public class Team {
    private Api api = new Api();

    // CONSTRUCTOR
    public Team(){ }

    // GET A TEAM BY ID
    public void getTeam(String idTeam, final Callback cb){
        api.getTeam(idTeam, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET TEAM", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject team = new JSONObject(data);
                Map<String, Object> myTeam = new HashMap<String, Object>();
                myTeam.put("team", team);
                cb.onSuccess(myTeam);
            }
        });
    }

    // GET TEAM PLAYERS
    public void getTeamPlayers(String id, final Callback cb){
        api.getTeamPlayers(id, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET TEAM PLAYERS", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONArray playerData = new JSONArray(data);
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("players", playerData);
                cb.onSuccess(options);
            }
        });
    }

    // UPDATE A TEAM
    public void updateTeam(Map<String, Object> options, final Callback cb){
        api.updateTeam(options, new Api.ApiCallback() {
            public void onFailure(String error) { Log.d("UPDATE TEAM", error); }
            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException { cb.onSuccess(new HashMap<String, Object>());  }
        });
    }

    // CALLBACK
    public interface Callback{
        public void onSuccess(Map<String, Object> options) throws JSONException;
    }
}
