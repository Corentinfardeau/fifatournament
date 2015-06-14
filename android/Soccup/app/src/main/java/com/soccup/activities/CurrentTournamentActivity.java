package com.soccup.activities;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.view.Menu;
import com.astuetz.PagerSlidingTabStrip;
import com.soccup.R;
import com.soccup.fragments.MatchsFragment;


public class CurrentTournamentActivity extends FragmentActivity{
    private PagerSlidingTabStrip tabs;
    private ViewPager viewPager;
    private TabsFragmentPagerAdapter adapter;
    private Bundle extras;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_current_tournament);
        extras = getIntent().getExtras();

        // PERSONALIZE TABS
        tabs = (PagerSlidingTabStrip) findViewById(R.id.tabs);
        tabs.setTextColor(0xFFFFFFFF);
        tabs.setDividerColor(0xFF00E676);
        tabs.setIndicatorColor(0xFFFFFFFF);
        tabs.setUnderlineHeight(0);
        tabs.setIndicatorHeight(6);

        viewPager = (ViewPager) findViewById(R.id.pager);
        adapter = new TabsFragmentPagerAdapter(getSupportFragmentManager());

        viewPager.setAdapter(adapter);
        tabs.setViewPager(viewPager);

        tabs.setOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            public void onPageSelected(int position) {
                if(position == 1) {
                    MatchsFragment frg = (MatchsFragment)adapter.instantiateItem(viewPager, position);
                    frg.reload();
                }
            }
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) { }
            public void onPageScrollStateChanged(int state) { }
        });
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    public Bundle getExtras(){
        return extras;
    }
}
