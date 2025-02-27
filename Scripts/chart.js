class Chart {
    /**
     * Description
     * @param {*} map 
     * @param {*} rows 
     * @param {*} xOffset 
     * @param {*} yOffset 
     * @param {*} xVel 
     * @param {*} yVel 
     * @param {*} progress 
     */
    constructor(map, rows, xOffset = 0, yOffset = 0, xVel = 0, yVel = 0, progress = 0, rate = 1) {
        this.map = map;
        this.rows = rows;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.xVel = xVel;
        this.yVel = yVel;
        this.progress = progress;
        this.rate = rate;

        this.audio = null;

        this.row = []
        /*Sets each row to an empty array for some purpose idk*/
        for (let i = 0; i < rows; i++) {
            this.row[i] = [];
            this.map["4Rows"]["Difficulty1"]["Notes"][i][0] += this.map["4Rows"]["Difficulty1"]["Offset"];
        }


        this.Load_Map()
    }

    // Load Chart
    Load_Map() {
        const mapChart = this.map["4Rows"]["Difficulty1"]["Notes"]; // Gets the difficulty Level
        for (let i in mapChart) { //
            try {
                console.log(i)
                const notes = mapChart[i];
                console.log(notes);
                for (let x = 0; x < notes.length; x++) {
                    const element = notes[x];
                    console.log(element); // 120bpm = 2/s
                    this.tempNote = new Note(i*100, -element/this.rate,this.row[i].length) // Creates note object
                    try { // A previous note doesn't always exist
                        this.tempNote.Set_Start_Pos([this.tempNote.Get_Pos()[0], (this.tempNote.Get_Pos()[1]) / (this.map["BPM"] / 60) /* /4 because 4/4 music notation */ + (this.row[i][this.row[i].length-1].Get_Pos()[1]) /* Gets previous not position */]); // Sets note y offset of previous note ([10,10] -> [10,20]) to avoid overlap and reduce map size
                        this.tempNote.Set_Pos(this.tempNote.Get_Start_Pos());
                    } catch (error) { }
                    this.Append(this.tempNote, i) // Appends note to row array which holds all notes
                }
            } catch (error) {
                return
            }
        }
    }

    /**
     * Returns map data (Map Name, Map Create, Etc.)
     */
    Get_MetaData() {
        return [this.map["Name"],this.map["Creator"],this.map["BPM"]]
    }

    /**
     * Adds note to chart
     * @param note The note object itself
     * @param row The row the note is appended to || Default: 0
     */
    Append(note, row = 0) {
        this.row[row].push(note); // Adds Note object to an array inside the rows array (EX: rows = [[note,note,note],[note,note]])
    }

    Remove(row) {
        this.row[row].shift();
    }

    UpdateNotes() {
        for (let i = 0; i < this.row.length; i++) {
            const _row = this.row[i];
            for (let j = 0; j < _row.length; j++) {
                const note = _row[j];
                note.Set_Pos([note.Get_Pos()[0], note.Get_Start_Pos()[1] + this.yVel * this.progress]);
            }
        }
    }
    //Update

    Get_Next(row) {
        return this.row[row][0]
    }

    Get_Rows() {
        return this.rows;
    }

    Get_Poss(row) {
        return this.row[row];
    }

    Get_Progress() {
        return this.progress;
    }

    Set_Progess(progress) {
        this.progress = progress;
        this.UpdateNotes()
    }

    ChangeProgress(change) {
        this.progress += change;
        this.UpdateNotes()
    }

    Update_Progress() {
        this.progress = this.audio.currentTime / this.rate;
        this.UpdateNotes()
    }

    Set_X_Offet(xOffset) {
        this.xOffset = xOffset
    }

    Set_Y_Offet(yOffset) {
        this.yOffset = yOffset
    }

    Set_X_Vel(xVel) {
        this.xVel = xVel;
    }

    Set_Y_Vel(yVel) {
        this.yVel = yVel;
    }

    Play_Audio(_rate) {
        const audioLocation = this.map["Audio"]; // Gets JSON url or directory location for audio
        this.audio = new Audio(audioLocation);
        this.audio.playbackRate = _rate;
        this.audio.play();
    }

    Stop_Audio() {
        if (this.audio != null) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    Get_Audio_Time() {
        return this.audio.currentTime;
    }
}
