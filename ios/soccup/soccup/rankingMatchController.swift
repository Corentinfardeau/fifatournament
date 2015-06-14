//
//  rankingMatchController.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class RankingMatchController: UIViewController, UITableViewDataSource, UITableViewDelegate  {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(animated: Bool) {
        view.backgroundColor = mainColor
    }
    
    let teams = ["Equipe 1", "Equipe 2", "Equipe 3"]
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return teams.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var cell = tableView.dequeueReusableCellWithIdentifier("cell") as! RankingTableViewCell
        cell.configure(nameTeam: "\(teams[indexPath.row])")
       
        if indexPath.row % 2 == 1 { //alternating row backgrounds
            cell.backgroundColor = backgroundColor
        } else {
            cell.backgroundColor = tableView.backgroundColor
        }
        
        return cell
    }
    
}


