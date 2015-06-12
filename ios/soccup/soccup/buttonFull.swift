//
//  button.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class ButtonFull: UIButton {
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        
        self.backgroundColor = mainColor
        self.tintColor = UIColor.whiteColor()
        self.titleLabel?.font = UIFont(name: "SourceSansPro-Regular", size: 17)
    }
}
