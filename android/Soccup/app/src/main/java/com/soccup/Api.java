package com.soccup;

import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import java.io.IOException;

/**
 * Created by Valentin on 28/05/2015.
 */
public class Api {
    private OkHttpClient client = new OkHttpClient();

    public void Api(){
        String response = this.run("https://raw.github.com/square/okhttp/master/README.md");
        System.out.println(response);
    }

    public String run(String url) throws IOException{
        Request request = new Request.Builder()
                .url(url)
                .build();

        Response response = client.newCall(request).execute();
        return response.body().string();
    }
}
