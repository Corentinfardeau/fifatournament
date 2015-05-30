package com.soccup;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.json.JSONException;

import java.io.IOException;

/**
 * Created by Valentin on 28/05/2015.
 */

public class Api{
    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private OkHttpClient client;
    private String address;
    private Request request;

    // CONSTRUCTOR
    public Api(){
        this.client = new OkHttpClient();
        this.address = "http://10.0.3.2:8080/";
    }

    // CREATE
    public void createTournament(String type, Boolean bePublic, Boolean random, int nbPlayers, int nbPlayersByTeam, final ApiCallback cb){
        String url = address + "api/tournament/create";
        String json = "{\"type\":\""+ type + "\","
            + "\"public\":"+ bePublic + ","
            + "\"random\":"+ random + ","
            + "\"nbPlayers\":"+ nbPlayers + ","
            + "\"nbPlayersByTeam\":"+ nbPlayersByTeam + "}";
        String onError = "Impossible de créer le tournament";

        // BUILD JSON
        RequestBody body = RequestBody.create(JSON, json);

        // BUILD REQUEST
        this.request = new Request.Builder().url(url).post(body).build();

        // CALL REQUEST
        call(this.request, onError,  cb);
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

    // CALL REQUEST
    private void call(Request request, final String error, final ApiCallback cb){
        Call call = this.client.newCall(this.request);
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
                }
            }
        });
    }

    public interface ApiCallback{
        public void onFailure(String error);
        public void onSuccess(Response response) throws IOException, JSONException;
    }
}
