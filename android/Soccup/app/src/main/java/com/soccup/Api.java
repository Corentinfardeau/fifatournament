package com.soccup;

import android.util.Log;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

/**
 * Created by Valentin on 28/05/2015.
 */

public class Api{

    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private OkHttpClient client;
    private Request request;
    private Call call;
    private JSONObject tournament;

    // CONSTRUCTOR
    public Api(){
        client = new OkHttpClient();
    }

    // CREATE
    public void createTournament(String type, Boolean bePublic, Boolean random, int nbPlayers, int nbPlayersByTeam){
        String url = "http://10.0.3.2:8080/api/tournament/create";
        String json = "{\"type\":\""+ type + "\","
            + "\"public\":"+ bePublic + ","
            + "\"random\":"+ random + ","
            + "\"nbPlayers\":"+ nbPlayers + ","
            + "\"nbPlayersByTeam\":"+ nbPlayersByTeam + "}";

        // BUILD JSON
        RequestBody body = RequestBody.create(JSON, json);

        // BUILD REQUEST
        this.request = new Request.Builder().url(url).post(body).build();
        this.call = this.client.newCall(this.request);

        // CALL
        this.call.enqueue(new Callback(){
            public void onFailure(Request request, IOException e) {
                Log.d("erreur", "Erreur lors de la création du tournament");
            }

            public void onResponse(Response response) throws IOException {
                try {
                    if (response.isSuccessful()) {
                        Log.d("okHttp", response.body().string());
                        String jsonData = response.body().string();
                        JSONObject forecast = new JSONObject(jsonData);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (JSONException e){
                    e.printStackTrace();
                }
            }
        });
    }

    public void createLeague(){

    }

    public void createMatchs(){

    }

    public void createTeams(){

    }

    // GET
    public void getLeague(){

    }
}
