package com.soccup.models;

import android.util.Log;

import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Valentin on 12/06/2015.
 */
public class League {
    private String idLeague;
    private Match objectMatch = new Match();
    private Api api = new Api();
    private JSONArray firstLeg;
    private JSONArray returnLeg;
    private ArrayList matchs = new ArrayList();

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

    public void getLeague(String idLeague, final Callback cb) throws JSONException {
        api.getLeague(idLeague, new Api.ApiCallback() {

            public void onFailure(String error) { Log.d("GET A LEAGUE", error); }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject dataLeague = new JSONObject(data);
                firstLeg = dataLeague.getJSONArray("firstLeg");
                returnLeg = dataLeague.getJSONArray("returnLeg");
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("league", dataLeague);
                cb.onSuccess(options);
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

    public void newMatch(final Callback cb) throws JSONException {
        final Boolean[] haveMatch = {false};
        final Map<String, Object> dataReturn = new HashMap<>();

        for(int i = 0; i < firstLeg.length(); i++){
            JSONObject theMatch = (JSONObject) firstLeg.get(i);

            if(theMatch.getBoolean("played") == false && haveMatch[0] == false){
                dataReturn.put("match", theMatch);
                dataReturn.put("type", "aller");
                haveMatch[0] = true;
            }
        }

        for(int i = 0; i < returnLeg.length(); i++){
            JSONObject theMatch = (JSONObject) returnLeg.get(i);

            if(theMatch.getBoolean("played") == false && haveMatch[0] == false){
                dataReturn.put("match", theMatch);
                dataReturn.put("type", "retour");
                haveMatch[0] = true;
            }
        }

        cb.onSuccess(dataReturn);
    }

    // CHECK IF ALL MATCHS ARE PLAYED
    public int checkMatchsPlayed() throws JSONException {
        int nbMatchs = firstLeg.length();
        int nbPlayed = 0;

        for (int i = 0; i < nbMatchs; i++) {
            JSONObject match = new JSONObject(firstLeg.getString(i));
            if(match.getBoolean("played") == true) nbPlayed ++;
        }

        for (int i = 0; i < nbMatchs; i++) {
            JSONObject match = new JSONObject(returnLeg.getString(i));
            if(match.getBoolean("played") == true) nbPlayed ++;
        }

        if(nbPlayed == (nbMatchs * 2)) return 0;
        else if(nbPlayed == (nbMatchs * 2) - 1) return 1;
        else return 2;
    }

    public String getIdLeague() {
        return idLeague;
    }

    public ArrayList getMatchs() {
        return matchs;
    }

    public void getAllMatchs(int iterator, final Callback cb) throws JSONException {
        final JSONObject match;
        final int newIterator = iterator + 1;

        if(iterator < firstLeg.length()) match = new JSONObject(firstLeg.getString(iterator));
        else match = new JSONObject(returnLeg.getString(iterator - firstLeg.length()));

        getMatch(match, new Match.Callback() {
            public void onSuccess(Map<String, Object> options) throws JSONException {
                JSONObject theMatch = (JSONObject) options.get("match");
                matchs.add(theMatch);

                if(newIterator < (returnLeg.length() + firstLeg.length())) getAllMatchs(newIterator, new Callback() { public void onSuccess(Map<String, Object> options) throws JSONException {cb.onSuccess(new HashMap<String, Object>()); }});
                else cb.onSuccess(new HashMap<String, Object>());
            }
        });
    }

    private void getMatch(JSONObject match, final Match.Callback cb) throws JSONException {
        objectMatch.getMatch(match.getString("_id"), new Match.Callback() {
            public void onSuccess(Map<String, Object> options) throws JSONException {
                JSONObject myMatch = (JSONObject) options.get("match");
                Map<String, Object> optionsMatch = new HashMap<String, Object>();
                optionsMatch.put("match", myMatch);
                cb.onSuccess(optionsMatch);
            }
        });
    }

    public void setMatchs(ArrayList matchs){
        this.matchs = matchs;
    }

    // CALLBACK
    public interface Callback{
        public void onSuccess(Map<String, Object> options) throws JSONException;
    }
}
