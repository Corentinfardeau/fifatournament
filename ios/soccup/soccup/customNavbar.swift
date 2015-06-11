//
//  CustomNavbar.swift
//  soccup
//
//  Created by Maxime DAGUET on 07/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class CustomNavbar: UINavigationController {

    override func viewDidLoad() {
        super.viewDidLoad()

//        navigationBar.backgroundColor = UIColor(red:0.204, green:0.872, blue:0.467, alpha:1)
//        navigationBar.setBackgroundImage(UIImage(), forBarMetrics: UIBarMetrics.Default)
//        navigationBar.translucent = true
//        navigationBar.shadowImage = UIImage()
//        UIBarButtonItem.appearance().setBackButtonBackgroundImage(UIImage(named: "arrow-left"), forState: .Normal, barMetrics: .Default)

        
        navigationBar.removeShadow()
        navigationBar.barTintColor = mainColor
        navigationBar.tintColor = UIColor.whiteColor()
        // Font for title
        navigationBar.titleTextAttributes = [ NSFontAttributeName: UIFont(name: "SourceSansPro-bold", size: 17)!,  NSForegroundColorAttributeName: UIColor.whiteColor()]
       // Font for back button
        UIBarButtonItem.appearance().setTitleTextAttributes([NSFontAttributeName: UIFont(name: "SourceSansPro-bold", size: 15)!], forState: UIControlState.Normal)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
