import { Title, Body } from '../components/Typography'
import config from '../config'

export default function GuidePage() {
  return (
    <div class="py-6 px-8">
      <Title>{config.appName} Guide</Title>
      <Body>
        {config.appName} is an app for organizing and marking images. Its
        primary use case is for work/achievement tracking
      </Body>

      <Title>Groups</Title>
      <Body>
        Groups can be created by clicking the + button in the Navigation Bar, or
        the Import Icon (<i class="fa-solid fa-file-import" />
        ). The + button will create a new empty group, while import can be used
        to bring in an existing group (for more, see "Exporting and Importing"
        below)
      </Body>
      <Body>
        Groups can be renamed using the input field at the bottom of each groups
        page. Groups can also be deleted by pressing the "Delete Group" button
        (if there is only one group it cannot be deleted).
      </Body>

      <Title>Images</Title>
      <Body>
        Working with images in {config.appName} starts by adding them to the
        app. This can be done by pasting an image from your clipboard onto a
        group. You don't need to select anything, you just need to be on a Group
        page (so, not on this guide) and have an image in your clipboard. You
        can get images in your clipboard using your favorite screenshot taking
        app, or by right-clicking an image in your browser and selecting "copy
        image".
      </Body>

      <Body>
        Once you have an image in a group you can re-order it with the arrow
        icons, delete it with the trash icon, or mark them up.
      </Body>

      <Body>
        Images can be marked up by clicking on them to enter edit mode or by
        CTRL+clicking them to Quick Mark to the clicked location. A Quick Mark
        will always use the most recently placed mark, or a basic red circle if
        none have been placed. Once you are done marking an image you can click
        the check mark in the top right to save the image. Quick Marks save
        automatically.
      </Body>

      <Title>Exporting and Importing</Title>
      <Body>
        Since data for {config.appName} is stored in the browser IndexedDB it is
        local to both the specific browser you are using and the user/container
        (if your browser supports that feature). Groups can be exported to text
        using the "Export Group" button, and imported by another browser or
        another user by pressing the Import Icon (
        <i class="fa-solid fa-file-import" />) and pasting the exported group
        text. Be warned: the serialized (text) form of a group contains all of
        its images, and so can be quite large. Some browsers may not be able to
        handle large group imports/exports.
      </Body>
    </div>
  )
}
