import time

from datetime import datetime, timedelta, timezone
import uuid
from pydb.upsertTag import upsertTag
from util import getTools, skipIfBusy, alwaysKeepSubs
from pydb.upsertPost import upsertPost
import re


nsfwSubreddits = 'gonewild+hentai+rule34+RealGirls+AsiansGoneWild+nsfw+PetiteGoneWild+ImGoingToHellForThis+gonewild30plus+NSFW_GIF+futanari+adorableporn+LegalTeens+BustyPetite+JizzedToThis+cumsluts+traps+TittyDrop+BiggerThanYouThought+GaybrosGoneWild+chubby+MassiveCock+yiff+BigBoobsGW+celebnsfw+pawg+JerkOffToCelebs+pussy+bigasses+thighdeology+collegesluts+ecchi+jobuds+ladybonersgw+milf+porn+GWCouples+BBW+ass+GodPussy+NSFWFunny+bigtiddygothgf+WouldYouFuckMyWife+darkjokes+holdthemoan+GirlsFinishingTheJob+HENTAI_GIF+MonsterGirl+nsfw_gifs+Baddieshub+OnOff+FemBoys+BreedingMaterial+Blowjobs+gonewildcurvy+kpopfap+workgonewild+anal+juicyasians+twinks+traphentai+Hotwife+WatchItForThePlot+TinyTits+AnimeMILFS+Overwatch_Porn+CuteLittleButts+Stacked+18_19+VerticalGifs+AsianHotties+trashyboners+palegirls+boobs+AzurLewd+cock+Amateur+bodyperfection+curvy+porninfifteenseconds+LabiaGW+paag+asstastic+Sissies+gonewildcolor+feet+LipsThatGrip+Ebony+suicidegirls+wincest+thick+AnalGW+hugeboobs+2busty2hide+assholegonewild+penis+Cuckold+Nudes+HappyEmbarrassedGirls+fitgirls+DadsGoneWild+HentaiBeast+onmww+bimbofetish+RealAhegao+IndiansGoneWild+wifesharing+Tgirls+nsfwhardcore+asshole+PreggoPorn+gwcumsluts+GoneWildPlus+altgonewild+ratemycock+gfur+Rule34LoL+Hotchickswithtattoos+normalnudes+grool+Shemales+Nude_Selfie+TooCuteForPorn+gonewildchubby+lesbians+JessicaNigri+xsmallgirls+GoneMild+latinas+boobbounce+bigtitsinbikinis+TotallyStraight+hentaimemes+burstingout+dirtykikpals+40plusGoneWild+DarkAngels+bois+transporn+bdsm+hardbodies+gwpublic+ghostnipples+Celebswithbigtits+deepthroat+IndianBabes+PokePorn+DeliciousTraps+Boobies+MorbidReality+gonewildcouples+Gonewild18+MedicalGore+Fire_Emblem_R34+BokuNoEroAcademia+tightdresses+gentlefemdom+ginger+biggerthanherhead+ThickDick+amateurgirlsbigcocks+WomenOfColor+amazingtits+theratio+foreskin+GoneWildTrans+buttplug+Upskirt+tanlines+lingerie+rearpussy+AnimeBooty+BadDragon+aa_cups+damngoodinterracial+freeuse+girlsinyogapants+BDSMGW+dykesgonewild+SlimThick+hotclub+PLASTT+HairyPussy+homegrowntits+PublicBoys+yuri+Sextrophies+UnderwearGW+AnimeFeet+dirtysmall+GoneWildHairy+SexyTummies+wholesomehentai+FitNakedGirls+RWBYNSFW+besthqporngifs+broslikeus+StraightGirlsPlaying+HugeHangers+Bulges+ShinyPorn+gothsluts+gaymersgonewild+AgedBeauty+hentaibondage+dirtypenpals+pantsu+ItsAmateurHour+bigonewild+Afrodisiac+PublicSexPorn+BigBoobsGonewild+gonewildaudio+squirting+Tentai+sexygirls+FestivalSluts+redheads+Misogynyfetish+GirlswithGlasses+phgonewild+NostalgiaFapping+JiggleFuck+mangonewild+DegradingHoles+animemidriff+JustHotWomen+Sexsells+ahegao+WhyEvenWearAnything+ButtsAndBareFeet+gaybears+WesternHentai+gayporn+NSFW_Japan+monsterdicks+wifepictrading+GoneWildCD+bigareolas+GuysFromBehind+Sissyperfection+Bondage+Natureisbrutal+GaySnapchat+hentai_irl+whenitgoesin+fortyfivefiftyfive+gettingherselfoff+nsfwcosplay+BigAnimeTiddies+couplesgonewild+PornStarletHQ+RateMyNudeBody+CosplayLewd+cleavage+thick_hentai+EngorgedVeinyBreasts+bigdickgirl+u_predsgirl92+blackchickswhitedicks+quiver+UpvotedBecauseButt+Sabrina_Nichole+Ifyouhadtopickone+FrogButt+SheLikesItRough+FlashingAndFlaunting+simps+gonewildstories+Teenboysgonewild+HugeDickTinyChick+ShemalesParadise+GoneWildSmiles+xxxcaptions+CelebrityButts+cuckoldcaptions+SluttyConfessions+PublicFlashing+STAWG+TrueFMK+Beardsandboners+Thicker+amateurcumsluts+NSFWBarista+bowsette+AssholeBehindThong+RedditorCum+IWantToSuckCock+slutwife+GabbieCarter+SnowWhites+Shadman+pelfie+AskRedditAfterDark+Innie+transformation+creampies+GWNerdy+cumfetish+Swingersgw+AngelaWhite+ThickThighs+GodAsshole+porn_gifs+RileyReid+ConfusedBoners+cosplaybutts+girlskissing+Artistic_Hentai+WrestleFap+sissycaptions+HungryButts+fuckdoll+BBW_Chubby+celebJObuds+Incest_Gifs+suctiondildos+facedownassup+lanarhoades+AutumnFalls+Balls+TessaFowler+MassiveTitsnAss+2Booty+ratemyboobs+treesgonewild+iwanttobeher+RepressedGoneWild+bustyasians+Pornheat+AvaAddams+AsianNSFW+Femdom+canthold+chastity+AreolasGW+Hitomi_Tanaka+tits+grailwhores+AssVsBoobs+boltedontits+assinthong+Workoutgonewild+SexInFrontOfOthers+SpreadEm+AmazingCurves+GroupOfNudeGirls+Humongousaurustits+AsianCuties+nude_snapchat+dirtyr4r+seethru+RetrousseTits+FurryPornSubreddit+Naruto_Hentai+TeensNSFW+pokies+chesthairporn+Pegging+Men2Men+momson+ChavGirls+BonerMaterial+Stuffers+femyiff+sissykik+ondww+HentaiSource+nsfwoutfits+CuteGuyButts+booty+SocialMediaSluts+doujinshi+GloryHo+RemyLaCroix+BBCparadise+IWantToBeHerHentai+GirlswithNeonHair+GoneWildScrubs+coltish+gifsgonewild+AdultNeeds+BBCSluts+randomsexiness+softies+whooties+CutCocks+CollegeAmateurs+LatinasGW+ddlg+cameltoe+GWAustralia+fitdrawngirls+NakedAdventures+RealPublicNudity+Tgifs+smallboobs+StormiMaya+petite+MiaMalkova+classysexy+DDLCRule34+Puffies+sources4porn+handholding+amateur_milfs+sissyhypno+DemiRoseMawby+VerifiedAmateurs+LiyaSilver+HotStuffNSFW+spreadeagle+LenaPaul+NekoIRL+Playboy+The_Best_NSFW_GIFS+Slut+torpedotits+fuckmeat+asiangirlswhitecocks+NieceWaidhofer+TheLostWoods+FauxBait+EraserNipples+Rule34Overwatch+hentaicaptions+HighMileageHoles+lactation+Nipples+1000ccplus+gilf+FaceFuck+littlespace+PantyPeel+Perfectdick+ssbbw+NSFWBOX+GonewildGBUK+FunWithFriends+SexyFrex+tanime+BBWGW+Slutoon+ChurchOfTheBBC+sarah_xxx+YouTubersGoneWild+u_PandoraNyxie+bikinis+BoobsBetweenArms+snapleaks+AgeplayPenPals+CumHentai+CheatingSluts+ThickChixxx+AsianGuysNSFW+OppaiLove+LingerieGW+stockings+maturemilf+Jia_Lissa+twerking+stupidslutsclub+AmateurPorn+60fpsporn+OldSchoolCoolNSFW+javdreams+Hentai4Everyone+guro+BreastEnvy+DrunkDrunkenPorn+manass+pornID+BrownHotties+downblouse+distension+piercednipples+NSFW_Snapchat+HorsecockFuta+FtMPorn+nextdoorasians+tightywhities+jacking+CamSluts+TributeMe+GayChubs+usedpanties+furryporn+NSFWfashion+ShinMegamiHentai+NSFWverifiedamateurs+BaileyJay+tipofmypenis+GoneErotic+CelebrityCandids+BestPornInGalaxy+PornStarHQ+SexyButNotPorn+GayGifs+HentaiParadise+BonersInPublic+KylieJenner+gayotters+FuckingPerfect+YogaPants+thighhighs+BBCsissies+EmilyBloom+ProgressiveGrowth+gaynsfw+HoleWreckers+PornMemes+CedehsHentai+LingeriePlus+ChiveUnderground+OnOffCelebs+creampie+anal_gifs+traaNSFW+yaoi+BestTits+DadsAndBoys+RealHomePorn+WhiteCheeks+Ahegao_IRL+mila_azul+Break_Yo_Dick_Thick+stripgirls+nudesfeed+gaystoriesgonewild+TheEroticSalon+Pee+SoHotItHurts+Breeding+jilling+UpskirtHentai+ChangingRooms+PantiesToTheSide+cumflation+NataLee+DirtySnapchat+Dbz34+BreakingTheSeal+FacialFun+CasualJiggles+Anal_witch+legs+FootFetish+O_Faces+Paizuri+braless+BoutineLA+AlexisTexas+Feet_NSFW+ElsaJean+Rule34RainbowSix+SissyChastity+AmateurSlutWives+ClopClop+titfuck+cheatingwives+datgap+Ohlympics+swingersr4r+Fay_Suicide+AdrianaChechik+pronebone+ChubbyDudes+FilthyGirls+NSFW411+Alisai+Lesbian_gifs+abelladanger+Ratemypussy+TeenTitansPorn+SexyFlightAttendants_+CarlieJo+Page3Glamour+ThotClub+HighResNSFW+Evalovia+Adult_Social_Network+PerkyChubby+WaifusOnCouch+cuteasfuckbutclothed+Exxxtras+Hotwifecaption+thickloads+MalesMasturbating+RandomActsOfBlowJob+raceplay+unexpectedtitty+CheatingCaptions+TheMomNextDoor+nsfwanimegifs+IrinaSabetskaya+throatbarrier+hentaifemdom+dillion_harper+Bottomless_Vixens+collared'


def updateAllListing(context):
    start = time.time()
    (conn, cur, reddit, pushshift) = context
    sfwPosts = list(reddit.subreddit("all").hot(limit=100))
    nsfwPosts = list(reddit.subreddit(nsfwSubreddits).hot(limit=100))
    alwaysPosts = list(reddit.subreddit("+".join(alwaysKeepSubs)).new(limit=100))
    print('afterload - ' + str(time.time() - start))
    all = sfwPosts + nsfwPosts + alwaysPosts
    for post in all:
        if post.subreddit_name_prefixed[:2] == "r/":
            upsertPost(context, post)
    print('aftersave - ' + str(time.time() - start))
    print('all ids = ['+ ",".join([post.id for post in all]) + ']')


def updateDeletedStatus(context):
    (conn, cur, reddit, pushshift) = context
    deleted = list(reddit.subreddit("undelete").new(limit=100))
    regex = re.compile('^https?:\/\/.+\/r\/.+\/comments\/([A-Za-z0-9]+)\/.+$')
    matches = [regex.match(post.url) for post in deleted]
    ids = [match.group(1) for match in matches if match is not None]
    notFoundIds = []
    for reddit_id in ids:
        cur.execute('SELECT id FROM post WHERE reddit_id = %s', (reddit_id,))
        row = cur.fetchone()
        if (row):
            upsertTag(context, 'reddit_deleted', row[0], True, commit=True)
        else:
            notFoundIds.append(reddit_id)
    # Load deleted posts that dont exist
    deletedPosts = list(reddit.info(fullnames=["t3_"+id for id in notFoundIds]))
    for post in deletedPosts:
        if post.subreddit_name_prefixed[:2] == "r/":
            id = upsertPost(context, post)
            upsertTag(context, 'reddit_deleted', id, True, commit=True)
    

if __name__ == "__main__":
    context = getTools()
    updateAllListing(context)
    updateDeletedStatus(context)
