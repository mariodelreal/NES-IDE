; INES header stuff
.inesprg 1   ; 1 bank of code
.ineschr 1   ; 1 bank of spr/bkg data
.inesmir 1   ; something always 1
.inesmap 0   ; we use mapper 0

.bank 1   ; following goes in bank 1
.org $FFFA  ; start at $FFFA
.dw 0    ; dw stands for Define Word and we give 0 as address for NMI routine
.dw Start ; give address of start of our code for execution on reset of NES.
.dw 0   ; give 0 for address of VBlank interrupt handler, we tell PPU not to
; make an interrupt for VBlank.

.bank 0   ; bank 0 - our place for code.
.org $8000  ; code starts at $8000

Start: lda #%00001000 ; do the setup of PPU sta $2000 ; that we lda #%00011110 ; talked about sta $2001 ; on a previous day

ldx #$00    ; clear X

lda #$3F    ; have $2006 tell
sta $2006   ; $2007 to start
lda #$00    ; at $3F00 (palette).
sta $2006

loadpal: ; this is a freaky loop lda tilepal, x ; that gives 32 numbers sta $2007 ; to $2007, ending when inx ; X is 32, meaning we cpx #32 ; are done. bne loadpal ; if X isn’t =32, goto “loadpal:” line.

waitblank: ; this is the wait for VBlank code from above lda $2002 ; load A with value at location $2002 bpl waitblank ; if bit 7 is not set (not VBlank) keep checking

lda #$00   ; these lines tell $2003
sta $2003  ; to tell
lda #$00   ; $2004 to start
sta $2003  ; at $0000.

lda #50  ; load Y value
sta $2004 ; store Y value
lda #$00  ; tile number 0
sta $2004 ; store tile number
lda #$00 ; no special junk
sta $2004 ; store special junk
lda #20  ; load X value
sta $2004 ; store X value
; and yes, it MUST go in that order.

infin: jmp infin ; JuMP to infin. note that this loop never ends. :)

tilepal: .incbin “our.pal” ; include and label our palette

.bank 2   ; switch to bank 2
.org $0000  ; start at $0000
.incbin "our.bkg"  ; empty background first
.incbin "our.spr"  ; our sprite pic data
; note these MUST be in that order.