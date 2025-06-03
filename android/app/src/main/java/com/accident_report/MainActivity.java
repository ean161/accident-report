package com.accident_report;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashScreenTheme);
        super.onCreate(savedInstanceState);
    }    @Override
    protected String getMainComponentName() {
        return "Báo va chạm";
    }
}
