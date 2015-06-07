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

        self.layer.cornerRadius = 20.0;
        self.backgroundColor = UIColor.whiteColor()
        self.tintColor = UIColor(red:0.204, green:0.872, blue:0.467, alpha:1)

    }
}
