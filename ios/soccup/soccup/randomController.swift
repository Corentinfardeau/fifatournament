//
//  randomController.swift
//  soccup
//
//  Created by Corentin FARDEAU on 31/05/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import Foundation
import UIKit

class randomController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        getTournament()
    }
    
    let localStorage = NSUserDefaults.standardUserDefaults()
    let api = API()
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func getTournament(){
        if let ID = self.localStorage.stringForKey("tournament"){
            api.getTournament(ID, completionHandler:{
                tournament, error in
                if((error) != nil){
                    println(error)
                }else{
                    println(tournament)
                }
            })
        }
    }
}
