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

    public Player(){

    }

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

    // CALLBACK
    public interface Callback{
        public void onSuccess(Map<String, Object> options) throws JSONException;
    }
}
