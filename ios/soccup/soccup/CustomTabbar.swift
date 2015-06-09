//
//  CustomTabbar.swift
//  
//
//  Created by Maxime DAGUET on 08/06/2015.
//
//

import UIKit

class CustomTabbar: UITabBarController {

    override func viewDidLoad() {
        super.viewDidLoad()

        tabBar.backgroundColor = UIColor.whiteColor()
        tabBar.shadowImage = UIImage()
        UITabBarItem.appearance().setTitleTextAttributes([NSFontAttributeName: UIFont(name: "SourceSansPro-regular", size: 12)!], forState: UIControlState.Normal)

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
