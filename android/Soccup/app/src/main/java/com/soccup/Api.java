package com.soccup;

import android.util.Log;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import java.io.IOException;

/**
 * Created by Valentin on 28/05/2015.
 */

public class Api {
    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private OkHttpClient client;
    private Response response;
    private Request request;
    private Call call;

    // CONSTRUCTOR
    public Api(){
        client = new OkHttpClient();
    }

    // CREATE
    public void createTournament(String type, Boolean bePublic, Boolean alea, int nbPlayers, int nbPlayersByTeam){
        String url = "http://localhost:8080/api/tournament/create";
        String json = "{'type':'"+ type + "',"
            + "'public':"+ bePublic + ","
            + "'alea':"+ alea + ","
            + "'nbPlayers':"+ nbPlayers + ","
            + "'nbPlayersByTeam':"+ nbPlayersByTeam + "}";
        Log.d("JSon", json);

        RequestBody body = RequestBody.create(JSON, json);
        this.request = new Request.Builder().url(url).post(body).build();
        this.call = this.client.newCall(this.request);

        this.call.enqueue(new Callback(){
            // ON ERROR
            public void onFailure(Request request, IOException e) {
                Log.d("erreur", "Erreur lors de la création du tournament");
            }

            // ON SUCCESS
            public void onResponse(Response response) throws IOException {
                try {
                    if (response.isSuccessful()) {
                        Log.d("okHttp", response.body().string());
                    }
                } catch (IOException e) {
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
