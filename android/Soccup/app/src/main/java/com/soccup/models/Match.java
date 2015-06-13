package com.soccup.models;

import android.util.Log;

import com.squareup.okhttp.Response;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Valentin on 13/06/2015.
 */
public class Match {
    private Api api = new Api();
    private Team objectTeam = new Team();

    public Match(){

    }


    public void getMatch(String idMatch, final Callback cb) {
        api.getMatch(idMatch, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET MATCH", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String dataMatch = response.body().string();
                final JSONObject currentMatch = new JSONObject(dataMatch);

                String idTeam;
                final ArrayList teams = new ArrayList();

                // GET THE TEAMS OF THE MATCH
                for(int i = 0; i < 2; i++){
                    final int finalI = i;

                    if(i == 0) idTeam = currentMatch.getString("homeTeam");
                    else idTeam = currentMatch.getString("awayTeam");

                    // GET A TEAM
                    objectTeam.getTeam(idTeam, new Team.Callback() {
                        public void onSuccess(Map<String, Object> options) throws JSONException {
                            JSONObject team = (JSONObject) options.get("team");
                            teams.add(team);

                            // IF ITS THE LAST TEAM OF THE MATCH, SHOW THE MATCH
                            if (teams.size() == 2) {
                                Map<String, Object> optionsMatch = new HashMap<String, Object>();
                                optionsMatch.put("teams", teams);
                                optionsMatch.put("match", currentMatch);
                                cb.onSuccess(optionsMatch);
                            }
                        }
                    });
                }
            }
        });
    }

    public void updateMatch(Map<String, Object> options, final Callback cb) {
        api.updateMatch(options, new Api.ApiCallback() {

            public void onFailure(String error) {
                Log.d("UPDATE MATCH", error);
            }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject dataMatch = new JSONObject(data);
                Map<String, Object> match = new HashMap<String, Object>();
                match.put("match", dataMatch);
                cb.onSuccess(match);
            }
        });
    }

    // CALLBACK
    public interface Callback{
        public void onSuccess(Map<String, Object> options) throws JSONException;
    }
}
