//
//  randomController.swift
//  soccup
//
//  Created by Corentin FARDEAU on 31/05/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import Foundation
import UIKit

class randomController: UITableViewController, UITableViewDataSource, UITableViewDelegate  {
    
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
    
    
    let teams = ["Equipe 1", "Equipe 2", "Equipe 3"]
    
    let players = [["Maxime", "Damien", "Corentin"], ["Ben", "Florian", "Valentin"], ["Joueur 1", "Joueur 2", "Joueur 3"]]
    
    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return teams.count
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection teams: Int) -> Int {
        return players[teams].count
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        //let cell = tableView.dequeueReusableCellWithIdentifier("cell") as! UITableViewCell
        //cell.textLabel?.text = items[indexPath.section][indexPath.row]
        //return cell
        
        let cell = tableView.dequeueReusableCellWithIdentifier("cell") as! TextInputTableViewCell
        cell.configure(text: "\(players[indexPath.section][indexPath.row])", placeholder: "Nom du joueur")
        return cell
    }
    
    override func tableView(tableView: UITableView, titleForHeaderInSection teams: Int) -> String? {
        return self.teams[teams]
    }
    
    
    //override func tableView(tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
    //return 40
    //}
}
