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
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
    
    
}
