//
//  button.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class Button: UIButton {
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)

        self.layer.cornerRadius = 25.0;
        self.backgroundColor = UIColor(red:0.204, green:0.872, blue:0.467, alpha:1)
        self.tintColor = UIColor.whiteColor()
        self.titleLabel?.font = UIFont(name: "SourceSansPro-Regular", size: 17)
    }
}
