//
//  CustomTabbar.swift
//  
//
//  Created by Maxime DAGUET on 08/06/2015.
//
//

import Foundation
import UIKit
import CoreImage

class CustomTabbar: UITabBarController {

    override func viewDidLoad() {
        super.viewDidLoad()

        UITabBar.appearance().backgroundColor = UIColor.whiteColor()
        UITabBar.appearance().clipsToBounds = true
        
        UITabBarItem.appearance().setTitleTextAttributes([NSFontAttributeName: UIFont(name: "SourceSansPro-regular", size: 12)!], forState: UIControlState.Normal)
        UITabBarItem.appearance().setTitleTextAttributes([NSForegroundColorAttributeName: textColor], forState:.Normal)
        UITabBarItem.appearance().setTitleTextAttributes([NSForegroundColorAttributeName: secondaryColor], forState:.Selected)
        
        for item in self.tabBar.items as! [UITabBarItem] {
            if let image = item.image {
                item.image = image.imageWithColor(textColor).imageWithRenderingMode(.AlwaysOriginal)
                item.selectedImage = image.imageWithColor(secondaryColor).imageWithRenderingMode(.AlwaysOriginal)
            }
        }

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
