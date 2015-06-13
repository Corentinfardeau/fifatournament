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
public class League {
    private String idLeague;
    private Api api = new Api();

    public League(){}


    public void createLeague(String idTournament, final Callback cb) {
        api.createLeague(idTournament, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Create League", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject dataLeague = new JSONObject(data);
                idLeague = dataLeague.getString("_id");

                Map<String, Object> optionsLeague = new HashMap<String, Object>();
                optionsLeague.put("league", dataLeague);
                cb.onSuccess(optionsLeague);
            }
        });
    }

    public void getRankingLeague(Map<String, Object> options, final Callback cb){
        api.getRankingLeague(options, new Api.ApiCallback() {

            public void onFailure(String error) {
                Log.d("GET RANKING LEAGUE", error);
            }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONArray teamsRanking = new JSONArray(data);

                Map<String, Object> winnerMap = new HashMap<String, Object>();
                winnerMap.put("teams", teamsRanking);
                cb.onSuccess(winnerMap);
            }
        });
    }

    public void createMatchs(Map<String, Object> optionsCreateMatchs,  final Callback cb) {
        api.createMatchsLeague(optionsCreateMatchs, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("Create Matchs League", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                cb.onSuccess(new HashMap<String, Object>());
            }
        });
    }

    public String getIdLeague() {
        return idLeague;
    }

    // CALLBACK
    public interface Callback{
        public void onSuccess(Map<String, Object> options) throws JSONException;
    }
}
