//
//  readyController.swift
//  soccup
//
//  Created by Corentin FARDEAU on 31/05/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import Foundation
import UIKit

class readyController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        let localStorage = NSUserDefaults.standardUserDefaults()
        
        let api = API()
        
        if let ID = localStorage.stringForKey("tournament"){
            api.getTournament(ID, completionHandler:{
                tournament, error in
                if((error) != nil){
                    println(error)
                }else{
                    if let teams: NSArray = tournament["teams"] as? NSArray{
                        
                    }
                }
            })
        }
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
}