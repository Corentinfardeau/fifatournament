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
public class Player {
    private Api api = new Api();

    // CONSTRUCTOR
    public Player(){  }

    // GET A PLAYER BY ID
    public void getPlayer(String idPlayer, final Callback cb){
        api.getPlayer(idPlayer, new Api.ApiCallback() {

            public void onFailure(String error) {
                Log.d("UPDATE PLAYER", error);
            }

            public void onSuccess(Response response) throws IOException, JSONException, InterruptedException {
                String data = response.body().string();
                JSONObject player = new JSONObject(data);
                Map<String, Object> options = new HashMap<String, Object>();
                options.put("player", player);
                cb.onSuccess(options);
            }
        });
    }

    // UPDATE A PLAYER
    public void updatePlayer(Map<String, Object> options, final Callback cb){
        api.updatePlayer(options, new Api.ApiCallback() {

            public void onFailure(String error) {  Log.d("UPDATE PLAYER", error);  }

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
