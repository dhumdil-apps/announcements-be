import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  async findAll(
    @Query('category') category?: string | string[],
    @Query('search') search?: string,
  ) {
    const categories = category
      ? Array.isArray(category)
        ? category
        : [category]
      : undefined;
    const announcements = await this.announcementsService.findAll(
      categories,
      search,
    );
    return { data: announcements.map((a) => ({ ...a, id: String(a.id) })) };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const announcement = await this.announcementsService.findOne(id);
    return { data: { ...announcement, id: String(announcement.id) } };
  }

  @Post()
  async create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    const announcement = await this.announcementsService.create(
      createAnnouncementDto,
    );
    return { data: { ...announcement, id: String(announcement.id) } };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    const announcement = await this.announcementsService.update(
      id,
      updateAnnouncementDto,
    );
    return { data: { ...announcement, id: String(announcement.id) } };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.announcementsService.remove(id);
  }
}
