package com.soccup.activities;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import com.soccup.fragments.CurrentMatchFragment;
import com.soccup.fragments.MatchsFragment;
import com.soccup.fragments.RankFragment;

public class TabsFragmentPagerAdapter extends FragmentPagerAdapter {
    private final String[] TITLES = { "EN COURS", "TOUS", "CLASSEMENT" };

    public TabsFragmentPagerAdapter(FragmentManager fm) {
        super(fm);
    }

    public CharSequence getPageTitle(int position) {
        return TITLES[position];
    }

    public Fragment getItem(int index) {
        switch (index) {
            case 0:
                return CurrentMatchFragment.newInstance(index);

            case 1:
                return MatchsFragment.newInstance(index);

            case 2:
                return RankFragment.newInstance(index);

            default:
                return null;
        }
    }

    public int getCount() {
        return TITLES.length;
    }

}