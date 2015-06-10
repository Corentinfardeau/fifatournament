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

        tabBar.backgroundColor = UIColor.whiteColor()
        tabBar.shadowImage = UIImage()
        UITabBarItem.appearance().setTitleTextAttributes([NSFontAttributeName: UIFont(name: "SourceSansPro-regular", size: 12)!], forState: UIControlState.Normal)
//        UITabBarItem.appearance().setTitleTextAttributes([NSForegroundColorAttributeName: UIColor.magentaColor()], forState:.Normal)
//        UITabBarItem.appearance().setTitleTextAttributes([NSForegroundColorAttributeName: UIColor.redColor()], forState:.Selected)
//        
//        for item in self.tabBar.items as! [UITabBarItem] {
//            if let image = item.image {
//                item.image = image.imageWithColor(UIColor.yellowColor()).imageWithRenderingMode(.AlwaysOriginal)
//            }
//        }
//        
//        extension UIImage {
//            func imageWithColor(tintColor: UIColor) -> UIImage {
//                UIGraphicsBeginImageContextWithOptions(self.size, false, self.scale)
//                
//                let context = UIGraphicsGetCurrentContext() as CGContextRef
//                CGContextTranslateCTM(context, 0, self.size.height)
//                CGContextScaleCTM(context, 1.0, -1.0);
//                CGContextSetBlendMode(context, kCGBlendModeNormal)
//                
//                let rect = CGRectMake(0, 0, self.size.width, self.size.height) as CGRect
//                CGContextClipToMask(context, rect, self.CGImage)
//                tintColor.setFill()
//                CGContextFillRect(context, rect)
//                
//                let newImage = UIGraphicsGetImageFromCurrentImageContext() as UIImage
//                UIGraphicsEndImageContext()
//                
//                return newImage
//            }
//        }

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
