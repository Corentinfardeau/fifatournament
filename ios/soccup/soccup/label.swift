//
//  label.swift
//  soccup
//
//  Created by Maxime DAGUET on 12/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class label: UILabel {
    
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        
        self.tintColor = secondaryColor
        self.textColor = secondaryColor
        self.font = UIFont(name: "SourceSansPro-Regular", size: 15)
    }
}
