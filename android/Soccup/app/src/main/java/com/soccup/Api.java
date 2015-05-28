package com.soccup;

import android.util.Log;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import java.io.IOException;

/**
 * Created by Valentin on 28/05/2015.
 */
public class Api {
    private OkHttpClient client = new OkHttpClient();
    private Response response;
    private Request request;
    private Call call;

    public Api(){
        this.request = new Request.Builder().url("http://www.critikcine.fr/api/v1/films/").build();
        this.call = this.client.newCall(this.request);
        this.call.enqueue(new Callback() {
            public void onFailure(Request request, IOException e) {

            }

            public void onResponse(Response response) throws IOException {
                try {
                    if(response.isSuccessful()){
                        Log.d("okHttp", response.body().string());
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
    }
}
