//
//  randomTeamsController.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import Foundation
import UIKit

class randomTeamsController: UIViewController, UITableViewDataSource, UITableViewDelegate  {
    
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
    
    let players = [["Maxime", "Damien", "Corentin"], ["Ben", "Florian", "Valentin"], ["Jean", "Paul", "Pierre"]]
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return teams.count
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection teams: Int) -> Int {
        return players[teams].count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("cell") as! LabelTableViewCell
        cell.configure(text: "\(players[indexPath.section][indexPath.row])")
        return cell
    }
    
    func tableView(tableView: UITableView, titleForHeaderInSection teams: Int) -> String? {
        return self.teams[teams]
    }
    
    func tableView(tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        let header: UITableViewHeaderFooterView = view as! UITableViewHeaderFooterView
        header.contentView.backgroundColor = UIColor.whiteColor()
        header.textLabel.textColor = UIColor.lightGrayColor()
        header.textLabel.font = UIFont(name: "SourceSansPro-Regular", size: 15)
        header.textLabel.textAlignment = NSTextAlignment.Center
    }
    
    
}
