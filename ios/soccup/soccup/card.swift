//
//  card.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class Card: UIView {
    
    required init(coder decoder: NSCoder) {
        super.init(coder: decoder)
        
        backgroundColor = UIColor.whiteColor()
    }
    
    override func drawRect(rect: CGRect) {
        updateLayerProperties()
    }
    
    func updateLayerProperties() {
        layer.masksToBounds = true
        layer.cornerRadius = 5.0
        layer.borderColor = borderColor.CGColor
        layer.borderWidth = 1.0
    }

}