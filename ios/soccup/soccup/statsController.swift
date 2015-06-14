//
//  statsController.swift
//  
//
//  Created by Maxime DAGUET on 13/06/2015.
//
//

import UIKit

class statsController: UIViewController, UITableViewDataSource, UITableViewDelegate  {
    
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        var backgroundView = UIView(frame: CGRectZero)
        self.tableView.tableFooterView = backgroundView
        self.tableView.backgroundColor = UIColor.clearColor()
        self.tableView.separatorStyle = UITableViewCellSeparatorStyle.None
        
        imageThumb.image = imageThumb.image!.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate)
        imageThumb.tintColor = borderColor
        
        imageThumbDown.image = imageThumbDown.image!.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate)
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
                    
                    self.api.getPlayers(tournament["_id"] as! String, completionHandler: {
                        players, error in
                        self.setFlopAndTopPlayer(players)
                    })
                    
                    dispatch_async(dispatch_get_main_queue(), {
                        self.teams = ranking as! [(Dictionary<String, AnyObject>)]
                        self.rankingTableView.reloadData()
                    })
                })
            })
        }
    }
    
    func setFlopAndTopPlayer(players:NSArray){
        
        for index in 0..<players.count{
            
            if(index == 0){
                
                self.topPlayer = players[index] as! Dictionary<String, AnyObject>
                self.flopPlayer = players[index] as! Dictionary<String, AnyObject>
                
            }else{
                
                if (players[index]["nbGoal"] as! Int > self.topPlayer["nbGoal"] as! Int ){
                    self.topPlayer = players[index] as! Dictionary<String, AnyObject>
                }
                
                if let playerGoals: Int = players[index]["nbGoal"] as? Int {
                    if (playerGoals < self.flopPlayer["nbGoal"] as! Int ){
                        self.flopPlayer = players[index] as! Dictionary<String, AnyObject>
                    }
                }
            }
        }
        
        self.labelTopPlayer.text = self.topPlayer["playerName"] as? String
        if let topPlayerGoals:AnyObject = self.topPlayer["nbGoal"]{
            self.labelGoalTopPlayer.text = "\(topPlayerGoals) buts"
        }
        
        self.labelFlopPlayer.text = self.flopPlayer["playerName"] as? String
        if let flopPlayerGoals:AnyObject = self.flopPlayer["nbGoal"]{
            self.labelGoalFlopPlayer.text = "\(flopPlayerGoals) buts"
        }
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return teams.count+1
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var cell = tableView.dequeueReusableCellWithIdentifier("cell") as! RankingTableViewCell
        if(indexPath.row == 0){
            cell.configureFirstLineStats()
        }else{
            cell.configureStats(nameTeam: teams[indexPath.row-1]["teamName"] as! String, played: teams[indexPath.row-1]["played"] as! Int, won: teams[indexPath.row-1]["won"] as! Int, lost: teams[indexPath.row-1]["lost"] as! Int, drawn: teams[indexPath.row-1]["drawn"] as! Int, gd: teams[indexPath.row-1]["gd"] as! Int, pts: teams[indexPath.row-1]["pts"] as! Int, color:teams[indexPath.row-1]["color"] as! String)
        }
        
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
    var topPlayer = Dictionary<String, AnyObject>()
    var flopPlayer = Dictionary<String, AnyObject>()
    
    @IBOutlet weak var rankingTableView: UITableView!
    @IBOutlet weak var imageThumb: UIImageView!
    @IBOutlet weak var imageThumbDown: UIImageView!
    @IBOutlet weak var cardView: Card!
    
    
    @IBOutlet weak var labelTopPlayer: UILabel!
    @IBOutlet weak var labelGoalTopPlayer: UILabel!
    
    
    @IBOutlet weak var labelFlopPlayer: UILabel!
    @IBOutlet weak var labelGoalFlopPlayer: UILabel!
    
}