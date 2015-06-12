package com.soccup.models;

import android.util.Log;

import com.squareup.okhttp.Response;

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

    public String getIdLeague() {
        return idLeague;
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

    // CALLBACK
    public interface Callback{
        public void onSuccess(Map<String, Object> options) throws JSONException;
    }
}
