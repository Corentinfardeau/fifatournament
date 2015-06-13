//
//  rankingMatchController.swift
//  soccup
//
//  Created by Maxime DAGUET on 06/06/2015.
//  Copyright (c) 2015 soccup. All rights reserved.
//

import UIKit

class RankingMatchController: UIViewController, UITableViewDataSource, UITableViewDelegate  {
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        self.view.backgroundColor = backgroundColor
        var backgroundView = UIView(frame: CGRectZero)
        self.tableView.tableFooterView = backgroundView
        self.tableView.backgroundColor = UIColor.clearColor()
        self.tableView.separatorStyle = UITableViewCellSeparatorStyle.None
        
        imageThumb.image = imageThumb.image!.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate)
        imageThumb.tintColor = borderColor
        
        imageThumbDown.image = imageThumb.image!.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate)
        imageThumbDown.tintColor = borderColor
    }
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        if let id = defaults.valueForKey("tournamentID") as? String {
            self.api.getTournament(id, completionHandler: {
                tournament, error in
                self.tournament = tournament
                self.api.getRanking(tournament["competition_id"] as! String, orderBy: "classic", completionHandler: {
                    ranking, error in
                    dispatch_async(dispatch_get_main_queue(), {
                        self.teams = ranking as! [(Dictionary<String, AnyObject>)]
                        self.rankingTableView.reloadData()
                    })
                })
            })
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return teams.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var cell = tableView.dequeueReusableCellWithIdentifier("cell") as! RankingTableViewCell
        cell.configure(nameTeam: teams[indexPath.row]["teamName"] as! String, played: teams[indexPath.row]["played"] as! Int, won: teams[indexPath.row]["won"] as! Int, lost: teams[indexPath.row]["lost"] as! Int, drawn: teams[indexPath.row]["drawn"] as! Int, gd: teams[indexPath.row]["gd"] as! Int, pts: teams[indexPath.row]["pts"] as! Int)
        
        cell.selectionStyle = UITableViewCellSelectionStyle.None
       
        if indexPath.row % 2 == 1 { //alternating row backgrounds
            cell.backgroundColor = backgroundColor
        } else {
            cell.backgroundColor = tableView.backgroundColor
        }
        
        return cell
    }
    
    var teams = [Dictionary<String, AnyObject>]()
    let api=API()
    let defaults = NSUserDefaults.standardUserDefaults()
    var tournament = Dictionary<String, AnyObject>()
    
    @IBOutlet weak var rankingTableView: UITableView!
    @IBOutlet weak var imageThumb: UIImageView!
    @IBOutlet weak var imageThumbDown: UIImageView!
    
}


