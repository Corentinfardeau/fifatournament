//
//  RemoveShadow.swift
//  soccup
//
//  Created by Maxime DAGUET on 11/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

extension UINavigationBar {
    
    func removeShadow() {
        if let view = removeShadowFromView(self) {
            view.removeFromSuperview()
            println("Removed Shadow: \(view)")
        }
    }
    func removeShadowFromView(view: UIView) -> UIImageView? {
        if (view.isKindOfClass(UIImageView) && view.bounds.size.height <= 1) {
            println("Found Shadow")
            return view as? UIImageView
        }
        for subView in view.subviews {
            if let imageView = removeShadowFromView(subView as! UIView) {
                return imageView
            }
        }
        return nil
    }
}
