# Barbara Dissociation Reinterpretation

## Original Clip Reference

- Film: `Night of the Living Dead` (1968)
- Rights status in Movianx target file: `public-domain`
- Source reference: `https://commons.wikimedia.org/wiki/File:Night_of_the_Living_Dead_(1968).webm`
- Target sequence: `00:12:00.000` to `00:12:24.000`
- Duration: `24s`
- Frame range at 24fps: `17280` to `17856`
- Source scene: `night-of-the-living-dead-1968:scene:3`

## Reinterpretation Node Selected

`night-of-the-living-dead-1968:rnode:3:barbara-dissociation`

Selected over the Ben/Cooper confrontation because this first proof-of-concept should minimize continuity risk. Barbara's shock sequence is emotionally strong, slower moving, and close enough to preserve the original film underneath while proving psychological reinterpretation.

## Emotional Objective

The reinterpretation should make Barbara's shock feel like dissociation. The scene should not become louder, more violent, or more visibly supernatural. It should feel like the room has become emotionally distant from her body while the original performance remains intact.

The audience should read the transformation as:

> another emotional reality hidden inside the original footage

Not:

> a newly generated scene

## Visual Continuity Requirements

- Preserve original shot timing and cut rhythm.
- Preserve Barbara's identity, face structure, mouth movement, body position, and eye line.
- Preserve the camera geometry and blocking.
- Preserve black-and-white 1968 independent horror texture.
- Keep head and tail frames close enough to splice back into the original timeline with straight cuts.
- Do not add new subjects, new monsters, gore, modern objects, or obvious visual effects.

## Prompt Package Used

See:

- `prompt-package.json`
- `comfyui-atmosphere-shift-filled.json`

Primary visual direction:

- 1960s black-and-white independent horror realism
- airless farmhouse interior
- colder grey highlights
- deeper practical shadows
- restrained dust/haze
- psychological dissociation
- original performance preserved

## Generated Reinterpretation Clip

Target path:

`output/barbara-dissociation-reinterpretation.webm`

Status:

`blocked_locally`

The generation package is ready, but this workstation context does not include:

- a checked-in original clip file
- ffmpeg
- a running ComfyUI workflow service
- Kling or Runway credentials/API runner

## Reintegrated Timeline Proof-of-Concept

Target path:

`output/barbara-dissociation-timeline-poc.webm`

Assembly plan:

`assembly-plan.json`

The reintegration must use hard cuts, not decorative transitions. If the generated head/tail frames do not match the source, the clip fails validation.

## Side-by-Side Emotional Comparison

Target path:

`output/barbara-dissociation-side-by-side.webm`

Comparison criteria:

- Left: untouched original source segment
- Right: reinterpreted segment
- Audio: original on both channels unless an approved subtle room-tone pass exists
- Duration: exact 24 seconds
- No speed change
- No frame interpolation that alters timing

## Technical Continuity Analysis

Expected pass conditions:

- Same duration as source segment
- Same fps as source segment
- No visible identity drift
- No new objects entering frame
- No camera re-composition
- No lip-sync distortion
- No temporal shimmer in hands, face, or background edges
- Head and tail frames match neighboring original timeline

Expected failure conditions:

- Barbara looks like a different performer
- The room layout changes
- The model adds ghosts, zombies, blood, or supernatural symbols
- The clip feels glossy, modern, or over-sharpened
- Motion feels interpolated or rubbery
- The reinterpretation calls attention to itself as generated

## Emotional Realism Assessment

Target emotional read:

Barbara is not simply scared. She is mentally disconnecting because the world has stopped obeying ordinary rules.

Successful version should feel:

- quiet
- stunned
- psychologically credible
- grounded in the original film
- inevitable

Unsuccessful version would feel:

- flashy
- artificial
- horror-trailer-like
- newly invented
- disconnected from the original scene

## External Render Checklist

1. Extract exact source clip `00:12:00.000` to `00:12:24.000`.
2. Run the video-to-video pass with `prompt-package.json`.
3. Reject outputs with identity drift or geometry drift.
4. Preserve original audio unless a subtle room-tone enhancement is approved.
5. Assemble `prehead + reinterpretation + tail` using `assembly-plan.json`.
6. Create side-by-side comparison.
7. Validate emotionally before any UI integration.
