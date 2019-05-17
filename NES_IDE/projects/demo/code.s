    .inesprg 1
    .inesmap 0
    .inesmir 1
    .ineschr 1

    .bank 1
    .org $FFFA
    .dw 0        ; no VBlank
    .dw Start    ; address to execute on reset
    .dw 0        ; no whatever

    .bank 0
    .org $0000
X_Pos .db 20
Y_Pos .db 20

    .org $8000  ; code starts at $8000 or $C000 Start:

Start:
    lda #%00001000  ; %vMsbpiNN
        ;v = Execute NMI on VBlank(non maskable interrupt): 1 = enabled
        ;M = PPU Selection (unused): 0 = master, 1 = slave
        ;s = Sprite Size: 0 = 8x8, 1 = 8x16
        ;b = Background Pattern Table Address: 0 = $0000 (VRAM), 1 = $1000 (VRAM)
        ;p = Sprite Pattern Table Address: 0 = $0000 (VRAM), 1 = $1000 (VRAM)
        ;i = PPU Address Increment: 0 = incremeny by 1, 1 = increment by 32
        ;NN = Name Table Address: 00 = $2000 (VRAM), 01 = $2400 (VRAM) 10 = $2800, 11 = $2C00 (VRAM)
    sta $2000       ;
    lda #%00011010  ; %fffpcsit
        ;fff = Full Background Color: 000 = black, 001 = red, 010 = blue, 100 = green
        ;p = Sprite Visibility: 1 = display
        ;c = Background Visibility: 1 = display
        ;s = Sprite Clipping: 0 = sprites not displayed in left 8-pixel column, 1 = no clipping
        ;i = Background Clipping: 0 = background not displayed in left 8-pixel column, 1 = no clipping
        ;t = Display Type: 0 = color display, 1 = mono-type(Black & White) display
    sta $2001       ;

    ldx #$00    ; clear X            ;; start of palette loading code

    lda #$3F    ; have $2006 tell
    sta $2006   ; $2007 to start
    lda #$00    ; at $3F00 (palette). ;universal color
    sta $2006

loadpal:
    lda tilepal, x
    sta $2007
    inx
    cpx #32
    bne loadpal

infinite:

waitblank:
    lda $2002
    bpl waitblank

    lda #$00   ; these lines tell $2003
    sta $2003  ; to tell
    lda #$00   ; $2004 to start
    sta $2003  ; at $0000.

    lda Y_Pos  ; load Y value
    sta $2004 ; store Y value

    lda #$00  ; tile number 0
    sta $2004 ; store tile number

    lda #$00 ; no special junk
    sta $2004 ; store special junk

    lda X_Pos  ; load X value
    sta $2004 ; store X value
    ; and yes, it MUST go in that order.

    lda #$01   ; these
    sta $4016  ; lines
    lda #$00   ; setup/strobe the
    sta $4016  ; keypad.

    lda $4016  ; load Abutton Status ; note that whatever we ain't interested
    lda $4016  ; load Bbutton Status ; in we just load so it'll go to the next one.
    lda $4016  ; load Select button status
    lda $4016  ; load Start button status
    lda $4016  ; load UP button status
    and #1     ; AND status with #1
    bne UPKEYdown  ; for some reason (not gonna reveal yet), need to use NotEquals
    ;with ANDs. So it'll jump (branch) if key was down.

    lda $4016  ; load DOWN button status
    and #1     ; AND status with #1
    bne DOWNKEYdown

    lda $4016  ; load LEFT button status
    and #1     ; AND status with #1
    bne LEFTKEYdown

    lda $4016  ; load RIGHT button status
    and #1     ; AND status with #1
    bne RIGHTKEYdown
    jmp NOTHINGdown  ; if nothing was down, we just jump (no check for conditions)
    ; down past the rest of everything.


UPKEYdown:
    lda Y_Pos
    sbc #1
    sta Y_Pos
    jmp NOTHINGdown

DOWNKEYdown:
    lda Y_Pos
    adc #1
    sta Y_Pos
    jmp NOTHINGdown

LEFTKEYdown:
    lda X_Pos
    sbc #1
    sta X_Pos
    jmp NOTHINGdown

RIGHTKEYdown:
    lda X_Pos
    adc #1
    sta X_Pos

NOTHINGdown: jmp infinite

tilepal:
    .incbin "./projects/{projectname}/palette.pal"
    .bank 2
    .org $0000
    .incbin "./projects/{projectname}/background.bkg"
    .incbin "./projects/{projectname}/sprite.spr"