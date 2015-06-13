//
//  labelLight.swift
//  soccup
//
//  Created by Maxime DAGUET on 13/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class labelLight: UILabel {

    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        
        self.tintColor = textColor
        self.textColor = textColor
        self.font = UIFont(name: "SourceSansPro-Regular", size: 15)
    }
    
}
