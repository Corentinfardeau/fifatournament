//
//  endController.swift
//  soccup
//
//  Created by Corentin FARDEAU on 11/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class endController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(animated: Bool)
    {
        self.navigationController?.navigationBarHidden = true
    }
    
    
}

