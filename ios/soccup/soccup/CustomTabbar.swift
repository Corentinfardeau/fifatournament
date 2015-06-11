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
    
    @IBAction func restartTournament(sender: AnyObject) {
        
        // Create the alert controller
        var alertController = UIAlertController(title: "Attention", message: "Êtes vous sur de vouloir quitter le tournoi ?", preferredStyle: .Alert)
        
        // Create the actions
        var cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel, handler : nil )
        
        var okAction = UIAlertAction(title: "Ok", style: UIAlertActionStyle.Default) {
            UIAlertAction in
            self.transition()
        }
        
        // Add the actions
        alertController.addAction(okAction)
        alertController.addAction(cancelAction)
        
        // Present the controller
        self.presentViewController(alertController, animated: true, completion: nil)
        
    }
    
    func transition(){
        self.performSegueWithIdentifier("GoToConfigController", sender:self)
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
